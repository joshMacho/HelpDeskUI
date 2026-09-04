export default function NSIABanner({ proposal }) {
  return (
    <div className="banner-div">
      <img src={`${import.meta.env.BASE_URL}logoOnly.png`} alt="Logo" />
      <p>
        <span>{proposal}</span>
      </p>
    </div>
  );
}
