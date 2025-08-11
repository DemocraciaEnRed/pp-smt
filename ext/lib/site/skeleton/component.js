// SkeletonIdeas.jsx
import React from "react";

export default function Skeleton() {
  return (
    <div className="skeleton-container">
      {/* Encabezado */}
      <div className="skeleton-header"></div>
      <div className="skeleton-subheader"></div>

      {/* Filtros */}
      <div className="skeleton-filters">
        <div className="skeleton-filter"></div>
        <div className="skeleton-filter"></div>
        <div className="skeleton-filter"></div>
      </div>

      {/* Barra búsqueda */}
      <div className="skeleton-search"></div>

      {/* Lista de proyectos */}
      {Array.from({ length: 4 }).map((e, i) => <div className="skeleton-card">
        <div className="skeleton-card-header">
          <div className="skeleton-avatar"></div>
          <div className="skeleton-line short"></div>
        </div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-tags">
          <div className="skeleton-tag"></div>
          <div className="skeleton-tag"></div>
        </div>
      </div>)}
    </div>

  );
}