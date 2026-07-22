import { BookOpen, Heart, Users, Verified } from "lucide-react";
import PurposeCard from "./PurposeCard";
import "./PurposeSection.css";

const PurposeSection = () => {
  return (
    <div className="purpose-section">
      <div className="purpose-header">
        <h2 className="section-title">Purpose of This Site</h2>
        <p>
          This website serves as a digital home for Kebena SDA Church, designed
          to keep our community connected, informed, and inspired. Whether
          you're a member, visitor, or someone seeking to learn more about our
          faith, we hope this platform helps you on your spiritual journey.
        </p>
      </div>

      <div className="purposes-grid">
        <PurposeCard
          icon={<Users />}
          title={"Connect & Fellowship"}
          description={
            "Building a community of believers who support and encourage one another in faith"
          }
        />
        <PurposeCard
          icon={<BookOpen />}
          title={"Learn & Grow"}
          description={
            "Providing resources and opportunities for spiritual education and personal growth"
          }
        />
        <PurposeCard
          icon={<Heart />}
          title={"Serve & Share"}
          description={
            "Sharing God's love through service to our community and beyond"
          }
        />
        <PurposeCard
          icon={<Verified />}
          title={"Worship & Praise"}
          description={
            "Creating opportunities to worship God together and celebrate His goodness"
          }
        />
      </div>
    </div>
  );
};

export default PurposeSection;
