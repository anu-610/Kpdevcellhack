import { supabase, isSupabaseConfigured } from './supabase'

// ─── Cache helpers ────────────────────────────────────────────────────────────
const CACHE_PREFIX = 'kp-dev-cell-cache'

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}
function readCache(key, fallback) {
  if (!isBrowser()) return fallback
  try { const r = window.localStorage.getItem(`${CACHE_PREFIX}:${key}`); return r ? JSON.parse(r) : fallback } catch { return fallback }
}
function writeCache(key, value) {
  if (!isBrowser()) return
  try { window.localStorage.setItem(`${CACHE_PREFIX}:${key}`, JSON.stringify(value)) } catch { }
}
function clearCache(prefix) {
  if (!isBrowser()) return
  try {
    const t = `${CACHE_PREFIX}:${prefix}`
    Object.keys(window.localStorage).forEach(k => { if (k.startsWith(t)) window.localStorage.removeItem(k) })
  } catch { }
}

// ─── Public cache-bust helpers ────────────────────────────────────────────────
// Called by Events.jsx after auto-archiving so the re-fetch hits Supabase, not cache
export function clearEventsCache() {
  clearCache('events')
}

// ─── READ timeout ─────────────────────────────────────────────────────────────
const READ_TIMEOUT_MS = 15000
function withReadTimeout(promise, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} read timed out`)), READ_TIMEOUT_MS)),
  ])
}

async function resolveListQuery({ cacheKey, fallback = [], queryFactory }) {
  const cached = readCache(cacheKey, fallback)
  if (!isSupabaseConfigured) return { data: cached, error: null }
  try {
    const { data, error } = await withReadTimeout(queryFactory(), cacheKey)
    if (error) { console.error(`[${cacheKey}]`, error); return { data: cached, error } }
    const result = data || fallback; writeCache(cacheKey, result); return { data: result, error: null }
  } catch (err) { console.error(`[${cacheKey}]`, err); return { data: cached, error: err } }
}

async function resolveSingleQuery({ cacheKey, fallback = null, queryFactory }) {
  const cached = readCache(cacheKey, fallback)
  if (!isSupabaseConfigured) return { data: cached, error: null }
  try {
    const { data, error } = await withReadTimeout(queryFactory(), cacheKey)
    if (error) { console.error(`[${cacheKey}]`, error); return { data: cached, error } }
    const result = data ?? fallback; writeCache(cacheKey, result); return { data: result, error: null }
  } catch (err) { console.error(`[${cacheKey}]`, err); return { data: cached, error: err } }
}

async function resolveCountQuery({ cacheKey, fallback = 0, queryFactory }) {
  const cached = readCache(cacheKey, fallback)
  if (!isSupabaseConfigured) return { count: cached, error: null }
  try {
    const { count, error } = await withReadTimeout(queryFactory(), cacheKey)
    if (error) return { count: cached, error }
    const result = count || 0; writeCache(cacheKey, result); return { count: result, error: null }
  } catch (err) { return { count: cached, error: err } }
}

// ─── safeMutation ─────────────────────────────────────────────────────────────
const MUTATION_TIMEOUT_MS = 30000

async function safeMutation(mutationFactory, cachePrefixes = []) {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Supabase not configured. Check your .env file.' } }
  }
  let timeoutId
  const backstop = new Promise((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error('Save timed out (30s). Check network and Supabase RLS policies.')),
      MUTATION_TIMEOUT_MS
    )
  })
  try {
    const result = await Promise.race([Promise.resolve().then(() => mutationFactory()), backstop])
    clearTimeout(timeoutId)
    if (result?.error) { console.error('Mutation error:', result.error); return result }
    cachePrefixes.forEach(clearCache)
    return result
  } catch (err) {
    clearTimeout(timeoutId)
    console.error('Mutation crashed:', err)
    return { data: null, error: { message: err?.message || 'Save failed' } }
  }
}

// ─── File upload ──────────────────────────────────────────────────────────────
export async function uploadFile(bucket, file, path) {
  if (!isSupabaseConfigured) return { url: null, error: { message: 'Supabase not configured' } }
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) { console.error('Upload error:', error); return { url: null, error } }
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path)
  return { url: publicUrl, error: null }
}

export async function deleteFile(bucket, path) {
  if (!isSupabaseConfigured) return { error: null }
  const { error } = await supabase.storage.from(bucket).remove([path])
  return { error }
}

// ─── Team Members ─────────────────────────────────────────────────────────────
export async function getTeamMembers(filters = {}) {
  const cacheKey = `team-members:${filters.category || 'all'}:${filters.isActive ?? 'all'}`
  return resolveListQuery({
    cacheKey, fallback: [],
    queryFactory: () => {
      let q = supabase.from('team_members').select('*')
        .order('category', { ascending: true }).order('name', { ascending: true })
      if (filters.category) q = q.eq('category', filters.category)
      if (filters.isActive !== undefined) q = q.eq('is_active', filters.isActive)
      return q
    },
  })
}
export async function addTeamMember(d)       { return safeMutation(() => supabase.from('team_members').insert([d]).select().single(),           ['team-members']) }
export async function updateTeamMember(id,d) { return safeMutation(() => supabase.from('team_members').update(d).eq('id',id).select().single(), ['team-members']) }
export async function deleteTeamMember(id)   { return safeMutation(() => supabase.from('team_members').delete().eq('id',id),                   ['team-members']) }

// ─── Events ───────────────────────────────────────────────────────────────────
export async function getEvents(isUpcoming = null) {
  const cacheKey = `events:${isUpcoming === null ? 'all' : isUpcoming ? 'upcoming' : 'past'}`
  return resolveListQuery({
    cacheKey, fallback: [],
    queryFactory: () => {
      let q = supabase.from('events').select('*').order('date', { ascending: false })
      if (isUpcoming !== null) q = q.eq('is_upcoming', isUpcoming)
      return q
    },
  })
}
export async function getUpcomingEvent() {
  return resolveSingleQuery({
    cacheKey: 'events:upcoming:first', fallback: null,
    queryFactory: () => supabase.from('events').select('*').eq('is_upcoming', true).order('date', { ascending: true }).limit(1).single(),
  })
}
export async function addEvent(d)       { return safeMutation(() => supabase.from('events').insert([d]).select().single(),           ['events']) }
// ✅ FIXED: removed .single() to prevent PGRST116 when RLS blocks the returning row
export async function updateEvent(id, d) {
  return safeMutation(
    async () => {
      const { data, error } = await supabase.from('events').update(d).eq('id', id).select()
      if (error) return { data: null, error }
      return { data: data?.[0] ?? null, error: null }
    },
    ['events']
  )
}
export async function deleteEvent(id)   { return safeMutation(() => supabase.from('events').delete().eq('id',id),                   ['events']) }

// ─── Posts ────────────────────────────────────────────────────────────────────
export async function getPosts(publishedOnly = true) {
  const cacheKey = `posts:${publishedOnly ? 'published' : 'all'}`
  return resolveListQuery({
    cacheKey, fallback: [],
    queryFactory: () => {
      let q = supabase.from('posts').select('*').order('published_at', { ascending: false })
      if (publishedOnly) q = q.eq('is_published', true)
      return q
    },
  })
}
export async function getPostById(id) {
  return resolveSingleQuery({ cacheKey: `post:${id}`, fallback: null, queryFactory: () => supabase.from('posts').select('*').eq('id', id).single() })
}
export async function addPost(d) {
  return safeMutation(() => supabase.from('posts').insert([{ ...d, published_at: d.is_published ? new Date().toISOString() : null }]).select().single(), ['posts','post:'])
}
export async function updatePost(id,d) {
  const u = { ...d }; if (d.is_published && !d.published_at) u.published_at = new Date().toISOString()
  return safeMutation(() => supabase.from('posts').update(u).eq('id',id).select().single(), ['posts', `post:${id}`])
}
export async function deletePost(id) { return safeMutation(() => supabase.from('posts').delete().eq('id',id), ['posts', `post:${id}`]) }

// ─── Achievements ─────────────────────────────────────────────────────────────
export async function getAchievements(limit = null) {
  const cacheKey = `achievements:${limit || 'all'}`
  return resolveListQuery({
    cacheKey, fallback: [],
    queryFactory: () => { let q = supabase.from('achievements').select('*').order('date', { ascending: false }); if (limit) q = q.limit(limit); return q },
  })
}
export async function addAchievement(d)       { return safeMutation(() => supabase.from('achievements').insert([d]).select().single(),           ['achievements']) }
export async function updateAchievement(id,d) { return safeMutation(() => supabase.from('achievements').update(d).eq('id',id).select().single(), ['achievements']) }
export async function deleteAchievement(id)   { return safeMutation(() => supabase.from('achievements').delete().eq('id',id),                   ['achievements']) }

// ─── Projects ─────────────────────────────────────────────────────────────────
export async function getProjects() {
  return resolveListQuery({ cacheKey: 'projects:all', fallback: [], queryFactory: () => supabase.from('projects').select('*').order('created_at', { ascending: false }) })
}
export async function addProject(d)       { return safeMutation(() => supabase.from('projects').insert([d]).select().single(),           ['projects']) }
export async function updateProject(id,d) { return safeMutation(() => supabase.from('projects').update(d).eq('id',id).select().single(), ['projects']) }
export async function deleteProject(id)   { return safeMutation(() => supabase.from('projects').delete().eq('id',id),                   ['projects']) }

// ─── Highlights ───────────────────────────────────────────────────────────────
export async function getHighlights() {
  return resolveListQuery({
    cacheKey: 'highlights:all', fallback: [],
    queryFactory: () => supabase.from('highlights').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false }),
  })
}
export async function addHighlight(d)       { return safeMutation(() => supabase.from('highlights').insert([d]).select().single(),           ['highlights']) }
export async function updateHighlight(id,d) { return safeMutation(() => supabase.from('highlights').update(d).eq('id',id).select().single(), ['highlights']) }
export async function deleteHighlight(id)   { return safeMutation(() => supabase.from('highlights').delete().eq('id',id),                   ['highlights']) }

// ─── Stats ────────────────────────────────────────────────────────────────────
export async function getStats() {
  const cacheKey = 'stats:overview'
  const cached = readCache(cacheKey, { members: 0, events: 0, posts: 0, achievements: 0, projects: 0 })
  if (!isSupabaseConfigured) return { data: cached, error: null }
  try {
    const [team, events, posts, achievements, projects] = await Promise.all([
      supabase.from('team_members').select('id', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('events').select('id', { count: 'exact', head: true }),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('achievements').select('id', { count: 'exact', head: true }),
      supabase.from('projects').select('id', { count: 'exact', head: true }),
    ])
    const result = { members: team.count||0, events: events.count||0, posts: posts.count||0, achievements: achievements.count||0, projects: projects.count||0 }
    writeCache(cacheKey, result); return { data: result, error: null }
  } catch (err) { return { data: cached, error: err } }
}

export async function getUpcomingEventsCount() {
  return resolveCountQuery({
    cacheKey: 'events:upcoming:count', fallback: 0,
    queryFactory: () => supabase.from('events').select('id', { count: 'exact', head: true }).eq('is_upcoming', true),
  })
}