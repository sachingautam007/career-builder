import SignUp from "./signup";

export default function SignUpPage() {
  return (
    <div className="container mx-auto mt-24 mb-20 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md">
        <SignUp />
      </div>
    </div>
  );
}

