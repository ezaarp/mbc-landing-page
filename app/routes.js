import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("projects", "routes/projects.jsx"),
  route("projects/:slug", "routes/project.jsx"),
  route("research", "routes/research.jsx"),
  route("research/:slug", "routes/research-item.jsx"),
  route("events", "routes/events.jsx"),
  route("events/:slug", "routes/event.jsx"),
  route("awards", "routes/awards.jsx"),
  route("awards/:slug", "routes/award-item.jsx"),
  route("blog", "routes/blogs.jsx"),
  route("blog/:slug", "routes/blog-item.jsx"),
];
