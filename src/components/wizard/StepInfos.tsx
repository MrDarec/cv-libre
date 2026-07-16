"use client";

import { useState } from "react";
import { useCVStore } from "@/lib/store";
import { Upload, Trash2, RotateCw, ZoomIn, Check, X } from "lucide-react";

const inputClass =
  "w-full bg-slate-50 dark:bg-zinc-800/30 border border-slate-200 dark:border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 dark:focus:border-indigo-500 dark:focus:ring-indigo-500/10 transition-all duration-200";

const labelClass =
  "block text-[10px] font-extrabold text-slate-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wider";

export default function StepInfos() {
  const { cv, setCV } = useCVStore();
  const { infos } = cv;
  const [isDragging, setIsDragging] = useState(false);

  // States for Image Cropping Modal
  const [croppingImageSrc, setCroppingImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const update = (field: keyof typeof infos, value: string | boolean) =>
    setCV((c) => ({ ...c, infos: { ...c.infos, [field]: value } }));

  // File Upload handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCroppingImageSrc(event.target.result as string);
          setZoom(1);
          setPosition({ x: 0, y: 0 });
          setRotation(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag & Drop handlers
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
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCroppingImageSrc(event.target.result as string);
          setZoom(1);
          setPosition({ x: 0, y: 0 });
          setRotation(0);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    update("photoUrl", "");
  };

  // Interaction handlers for dragging inside crop area
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragStart) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  // Mobile touch controls
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStart || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  // Perform final crop onto Canvas
  const handleCropSave = () => {
    if (!croppingImageSrc) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // 1. Translate center of canvas
        ctx.translate(150, 150);

        // 2. Rotate canvas
        ctx.rotate((rotation * Math.PI) / 180);

        // 3. Translate dragging offset
        ctx.translate(position.x, position.y);

        // 4. Scale image to fit 300px crop box, multiplied by custom zoom
        const baseScale = 300 / Math.min(img.width, img.height);
        ctx.scale(baseScale * zoom, baseScale * zoom);

        // 5. Draw image centered
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        // Compress base64 to keep storage small
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        update("photoUrl", dataUrl);
        setCroppingImageSrc(null);
      }
    };
    img.src = croppingImageSrc;
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
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCroppingImageSrc(infos.photoUrl!);
                      setZoom(1);
                      setPosition({ x: 0, y: 0 });
                      setRotation(0);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-650 hover:text-indigo-600 transition-colors uppercase tracking-wider"
                  >
                    Recadrer la photo
                  </button>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-500 hover:text-red-650 transition-colors uppercase tracking-wider"
                  >
                    <Trash2 size={12} /> Supprimer
                  </button>
                </div>
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
                {"Formats supportés : PNG, JPG. Ajustez ensuite le recadrage."}
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

      {/* Image Cropper Modal */}
      {croppingImageSrc && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setCroppingImageSrc(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-105 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <X size={16} />
            </button>

            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4">
              Recadrer et ajuster la photo
            </h3>

            {/* Crop Window Area */}
            <div className="flex flex-col items-center justify-center gap-6">
              <div
                className="w-64 h-64 rounded-full relative overflow-hidden bg-slate-100 dark:bg-zinc-950 border-4 border-indigo-500/50 shadow-inner cursor-move flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={croppingImageSrc}
                  alt="A rogner"
                  className="max-w-none absolute pointer-events-none origin-center"
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                    // Base scale fitting shorter side to 256px
                    width: "100%",
                    height: "auto",
                  }}
                />
              </div>

              <p className="text-[10px] text-slate-500 dark:text-zinc-400 text-center leading-normal max-w-xs">
                {"Glissez la photo pour la recentrer. Utilisez les commandes ci-dessous pour l'ajuster."}
              </p>

              {/* Controls */}
              <div className="w-full space-y-4 px-2">
                {/* Zoom control */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <span>Zoom</span>
                    <span className="text-slate-700 dark:text-zinc-350">{Math.round(zoom * 100)}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ZoomIn size={14} className="text-slate-400" />
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="0.01"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>

                {/* Rotation control */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300 transition-all"
                  >
                    <RotateCw size={13} />
                    <span>Pivoter 90°</span>
                  </button>
                  <span className="text-[10px] font-bold text-slate-400">Orientation : {rotation}°</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 w-full pt-2">
                <button
                  type="button"
                  onClick={() => setCroppingImageSrc(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800 text-slate-750 dark:text-zinc-300 text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleCropSave}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  <Check size={14} />
                  Valider la photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
