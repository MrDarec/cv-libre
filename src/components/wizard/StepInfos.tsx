"use client";

import { useState } from "react";
import { useCVStore } from "@/lib/store";
import { Upload, Trash2 } from "lucide-react";

const inputClass =
  "w-full bg-slate-50 dark:bg-zinc-800/30 border border-slate-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10 transition-all duration-200";

const labelClass =
  "block text-[10px] font-extrabold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider";

// Utility to center-crop to square and resize image client-side to 300x300px
const resizeImage = (file: File, callback: (base64: string) => void) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 300;
      const MAX_HEIGHT = 300;
      const width = img.width;
      const height = img.height;

      // Crop to a square center
      const size = Math.min(width, height);
      const xOffset = (width - size) / 2;
      const yOffset = (height - size) / 2;

      canvas.width = MAX_WIDTH;
      canvas.height = MAX_HEIGHT;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          img,
          xOffset,
          yOffset,
          size,
          size,
          0,
          0,
          MAX_WIDTH,
          MAX_HEIGHT
        );
        // Compress as JPEG to keep Base64 string small (<20KB) for localStorage persistence
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        callback(dataUrl);
      }
    };
    img.src = event.target?.result as string;
  };
  reader.readAsDataURL(file);
};

export default function StepInfos() {
  const { cv, setCV } = useCVStore();
  const { infos } = cv;
  const [isDragging, setIsDragging] = useState(false);

  const update = (field: keyof typeof infos, value: string | boolean) =>
    setCV((c) => ({ ...c, infos: { ...c.infos, [field]: value } }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      resizeImage(file, (base64) => {
        update("photoUrl", base64);
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      resizeImage(file, (base64) => {
        update("photoUrl", base64);
      });
    }
  };

  const removePhoto = () => {
    update("photoUrl", "");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Informations personnelles</h2>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Renseigne tes coordonnées pour que les recruteurs puissent te contacter facilement.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Prénom</label>
          <input
            className={inputClass}
            placeholder="ex: Jean"
            value={infos.prenom}
            onChange={(e) => update("prenom", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Nom</label>
          <input
            className={inputClass}
            placeholder="ex: Dupont"
            value={infos.nom}
            onChange={(e) => update("nom", e.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Titre / poste recherché</label>
          <input
            className={inputClass}
            placeholder="ex: Développeur Full-Stack"
            value={infos.titre}
            onChange={(e) => update("titre", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            className={inputClass}
            type="email"
            placeholder="jean.dupont@email.com"
            value={infos.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Téléphone</label>
          <input
            className={inputClass}
            placeholder="+33 6 12 34 56 78"
            value={infos.telephone}
            onChange={(e) => update("telephone", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Ville</label>
          <input
            className={inputClass}
            placeholder="Paris"
            value={infos.ville}
            onChange={(e) => update("ville", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Pays</label>
          <input
            className={inputClass}
            placeholder="France"
            value={infos.pays}
            onChange={(e) => update("pays", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>LinkedIn (optionnel)</label>
          <input
            className={inputClass}
            placeholder="linkedin.com/in/jeandupont"
            value={infos.linkedin || ""}
            onChange={(e) => update("linkedin", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>GitHub / Portfolio (optionnel)</label>
          <input
            className={inputClass}
            placeholder="github.com/jeandupont"
            value={infos.github || ""}
            onChange={(e) => update("github", e.target.value)}
          />
        </div>

        {/* Photo Upload Zone */}
        <div className="sm:col-span-2 space-y-2">
          <label className={labelClass}>Photo de profil (optionnelle)</label>
          {infos.photoUrl ? (
            <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={infos.photoUrl}
                alt="Aperçu"
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-zinc-700 shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">Photo chargée avec succès</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">Automatiquement centrée au format carré recommandé (300x300px)</p>
                <button
                  type="button"
                  onClick={removePhoto}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                >
                  <Trash2 size={12} /> Supprimer la photo
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-150 relative ${
                isDragging
                  ? "border-slate-900 bg-slate-100/50 dark:border-indigo-500 dark:bg-indigo-950/20"
                  : "border-slate-200 hover:border-slate-400 bg-slate-50/20 dark:border-zinc-800 dark:hover:border-zinc-700 dark:bg-zinc-900/10"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="photo-file-input"
              />
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 shadow-sm border border-slate-100 dark:border-zinc-700/80 mb-2">
                <Upload size={18} />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                {"Glisser-déposer ou cliquer pour choisir une image"}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
                {"Formats supportés : PNG, JPG. Redimensionnement carré automatique."}
              </p>
            </div>
          )}
        </div>
        
        <label className="sm:col-span-2 flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 text-xs font-semibold text-slate-700 dark:text-zinc-300 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-zinc-800/50 transition-colors">
          <input
            type="checkbox"
            className="rounded border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-indigo-600 focus:ring-slate-900 dark:focus:ring-indigo-500 h-4 w-4"
            checked={infos.inclurePhoto}
            onChange={(e) => update("inclurePhoto", e.target.checked)}
          />
          <span>Inclure la photo sur le CV</span>
        </label>
      </div>

      <div className="pt-2">
        <label className={labelClass}>Résumé / accroche professionnelle</label>
        <textarea
          className={inputClass}
          rows={3}
          placeholder="2 à 3 phrases claires sur ton profil, tes points forts et ce que tu recherches..."
          value={cv.resume}
          onChange={(e) => setCV((c) => ({ ...c, resume: e.target.value }))}
        />
      </div>
    </div>
  );
}
