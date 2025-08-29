import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

const MyDetailsTab = () => {
  const userDetails = {
    firstName: "Ronald",
    lastName: "Williams",
    email: "ronald@mail.com",
    phone: "+1 234 567 890",
    dateOfBirth: "1990-01-01",
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">My Details</h2>
      <div className="space-y-6 max-w-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input id="firstName" defaultValue={userDetails.firstName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input id="lastName" defaultValue={userDetails.lastName} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" defaultValue={userDetails.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" type="tel" defaultValue={userDetails.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" type="date" defaultValue={userDetails.dateOfBirth} />
        </div>
        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default MyDetailsTab;
