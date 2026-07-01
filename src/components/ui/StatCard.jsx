function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="card stat-card h-100">
      <div className="card-body d-flex justify-content-between align-items-start">
        <div>
          <p className="text-muted mb-1">{title}</p>
          <h3 className="fw-bold mb-1">{value}</h3>
          {subtitle && <small className="text-muted">{subtitle}</small>}
        </div>
        {Icon && (
          <div className="stat-icon">
            <Icon size={22} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StatCard;
