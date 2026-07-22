const PurposeCard = ({ icon, title, description }) => {
  return (
    <div className="purpose-card">
      <div className="icon">
        <span>{icon}</span>
      </div>
      <h4 className="purpose-title">{title}</h4>
      <p className="purpose-desc">{description}</p>
    </div>
  );
};

export default PurposeCard;
