import "./two-cta-styles.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import ButtonComponent from "../button/button-component";


const TwoCtaComponent = () => {
  const ctaItems = [
    {
      id: 1,
      title: "Blood Donation",
      image: "/images/cta-1.jpg",
      link: "/donate-blood",
      buttonText: "Donate Now"
    },
    {
      id: 2,
      title: "Request Blood",
      image: "/images/cta-2.jpg",
      link: "/need-blood",
      buttonText: "Request Now"
    },
    {
      id: 3,
      title: "Blood Drives",
      image: "/images/cta-3.jpg",
      link: "/blood-drives",
      buttonText: "Find Drives"
    },
    {
      id: 4,
      title: "Become a Donor",
      image: "/images/cta-4.jpg",
      link: "/register",
      buttonText: "Register Now"
    },
    {
      id: 5,
      title: "Volunteer",
      image: "/images/cta-5.jpg",
      link: "/volunteer",
      buttonText: "Join Us"
    },
    {
      id: 6,
      title: "Blood Banks",
      image: "/images/cta-6.jpg",
      link: "/blood-banks",
      buttonText: "Find Banks"
    },
    {
      id: 7,
      title: "Events",
      image: "/images/cta-7.jpg",
      link: "/events",
      buttonText: "View Events"
    },
    {
      id: 8,
      title: "About Us",
      image: "/images/cta-8.jpg",
      link: "/about",
      buttonText: "Learn More"
    }
  ];

  return (
    <WrapperSection>
      <div className="cta-grid">
        {ctaItems.map((item) => (
          <div key={item.id} className="cta-grid-item">
            <div 
              className="cta-item-content"
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className="cta-overlay">
                <h3 className="cta-title">{item.title}</h3>
                <ButtonComponent
                  buttonText={item.buttonText}
                  buttonLink={item.link}
                  buttonType={"line"}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </WrapperSection>
  );
};

export default TwoCtaComponent;
