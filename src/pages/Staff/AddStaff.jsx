import { useState } from "react";
import { supabase } from "../../api/supabaseClient";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function AddStaff() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return alert("Nama wajib diisi");

    const { error } = await supabase.from("staff").insert(form);
    if (error) alert(error.message);
    else navigate("/staff");
  }

  return (
    <LayoutWrapper>
      <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Tambah Staff
      </h1>

      <form
        className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full md:w-1/2
                   text-black dark:text-white"
        onSubmit={handleSubmit}
      >
        <label className="block mb-2">Nama</label>
        <input
          name="name"
          className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700
                     text-black dark:text-white 
                     p-2 w-full mb-3 rounded"
          onChange={handleChange}
        />

        <label className="block mb-2">Telepon</label>
        <input
          name="phone"
          className="border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-700
                     text-black dark:text-white 
                     p-2 w-full mb-3 rounded"
          onChange={handleChange}
        />

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Simpan
        </button>
      </form>
    </LayoutWrapper>
  );
}
