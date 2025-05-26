import {Input} from "@heroui/react";

export default function Inputs() {
  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
      <Input label="Email" type="email" placeholder="Enter your email" />

    </div>
  );
}
