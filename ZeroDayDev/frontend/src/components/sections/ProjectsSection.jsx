import { ExternalLink } from "lucide-react";
import { EmptyState } from "../common/EmptyState.jsx";
import { SectionHeader } from "../common/SectionHeader.jsx";
import { getProjects } from "../../services/contentService.js";
import { useAsyncResource } from "../../hooks/useAsyncResource.js";

export function ProjectsSection() {
  const { data: projects, status } = useAsyncResource(getProjects);

  return (
    <section className="content-section" id="projects">
      <SectionHeader
        kicker="Work"
        title="Projects done"
        
      />

      {projects.length ? (
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project._id || project.id}>
              {project.imageUrl || project.image ? (
                <img
                  src={project.imageUrl || project.image}
                  alt={project.title || project.name || "Project"}
                />
              ) : null}
              <div className="project-card-body">
                <h3>{project.title || project.name}</h3>
                <p>{project.description}</p>
                {project.link || project.liveUrl || project.githubUrl ? (
                  <a
                    href={project.link || project.liveUrl || project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open project <ExternalLink size={16} />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title={status === "loading" ? "Loading projects..." : "No projects added yet"}
          message="Your real project records will render here after the backend returns them."
        />
      )}
    </section>
  );
}
