import { SignUp } from "@clerk/nextjs";
 
export default function Page() {
  return <SignUp appearance={{
    variables: {
      fontSize: '15px',
      spacingUnit: '15px',
    }
  }} />;
}