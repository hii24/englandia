import { Modal, NumberInput, Input, Button } from "@/components/ui";
import React, { useState } from "react";

interface RegistrationModalProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: 5,
  comment: "",
};

const RegistrationModal: React.FC<RegistrationModalProps> = ({
  onSubmit,
  onClose,
}) => {
  const [form, setForm] = useState(initialState);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal open={true} onClose={onClose}>
      <form
        className="flex flex-col gap-5 registration-modal-form"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center font-bold text-2xl">
          Запишитесь на бесплатное занятие
        </h2>
        <Input
          placeholder="Имя *"
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
        />
        <Input
          placeholder="Фамилия"
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
        />
        <Input
          placeholder="Email *"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        <Input
          placeholder="Телефон"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
        />

        <NumberInput
          label="Возраст ребенка, лет"
          value={form.age}
          min={4}
          max={12}
          onChange={(value) => handleChange("age", value)}
        />

        <Input
          placeholder="Комментарий"
          value={form.comment}
          onChange={(e) => handleChange("comment", e.target.value)}
        />
        <div className="flex justify-center">
          <Button type="submit" showIcon>
            Отправить
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RegistrationModal;
