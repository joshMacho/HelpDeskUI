import PasswordResetForm from "../components/forms/PasswordResetForm";

export default function PasswordResetPage() {
  const onSuccess = () => {
    console.log("successfull");
  };
  return (
    <div className="main-page">
      <div className="main2">
        <div className="in-form">
          <PasswordResetForm onSuccess={onSuccess} />
        </div>
      </div>
    </div>
  );
}
