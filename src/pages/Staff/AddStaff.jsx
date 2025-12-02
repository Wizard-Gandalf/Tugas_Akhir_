import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabaseClient";
import LayoutWrapper from "../../components/layout/LayoutWrapper";

export default function AddStaff() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    position: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Nama wajib diisi");
      return;
    }

    const { error } = await supabase.from("staff").insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      position: form.position.trim(),
    });

    if (error) {
      alert(error.message);
    } else {
      navigate("/app/staff");
    }
  }

  return (
    <LayoutWrapper>
      <h1 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Tambah Petugas
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow w-full md:w-1/2
                           text-black dark:text-white"
      >
        <label className="block mb-2">Nama</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                               text-black dark:text-white p-2 w-full mb-3 rounded"
        />

        <label className="block mb-2">Telepon</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                               text-black dark:text-white p-2 w-full mb-3 rounded"
        />

        <label className="block mb-2">Posisi</label>
        <input
          name="position"
          value={form.position}
          onChange={handleChange}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700
                               text-black dark:text-white p-2 w-full mb-4 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Simpan
        </button>
      </form>
    </LayoutWrapper>
  );
}
