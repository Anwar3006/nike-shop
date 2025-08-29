import { Button } from "./ui/button";
import { Home, Briefcase } from "lucide-react";

const AddressBookTab = () => {
  const addresses = [
    {
      type: "Home" as const,
      icon: <Home className="w-5 h-5 text-gray-500" />,
      address: "123 Market St, San Francisco, CA 94103",
      phone: "+1 234 567 890",
      isDefault: true,
    },
    {
      type: "Work" as const,
      icon: <Briefcase className="w-5 h-5 text-gray-500" />,
      address: "456 Main St, Oakland, CA 94612",
      phone: "+1 098 765 432",
      isDefault: false,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Address Book</h2>
        <Button>Add New Address</Button>
      </div>
      <div className="space-y-4">
        {addresses.map((addr, index) => (
          <div
            key={index}
            className="p-6 border border-gray-200 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4"
          >
            <div className="flex gap-4">
              {addr.icon}
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{addr.type}</h3>
                  {addr.isDefault && (
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{addr.address}</p>
                <p className="text-gray-600">{addr.phone}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBookTab;
