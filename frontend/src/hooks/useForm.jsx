import { useState } from "react";

export default function useForm(FormData) {
  const [form, setForm] = useState(FormData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });

   
  };

  const resetForm = () => {
    setForm(FormData); 
  };

  return { values:form, handleChange, resetForm };
}