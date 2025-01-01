import {RegisterForm} from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Event Registration</h1>
      <RegisterForm />
    </div>
  );
}
