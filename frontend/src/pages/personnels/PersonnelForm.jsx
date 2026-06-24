import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver }         from '@hookform/resolvers/zod'
import { User, Phone, Briefcase, Camera, Check } from 'lucide-react'
import Input        from '@/components/ui/Input'
import Select       from '@/components/ui/Select'
import Button       from '@/components/ui/Button'
import FormSection  from '@/components/shared/FormSection'
import { personnelSchema } from '@/utils/validators'
import { useReferentiel }  from '@/hooks/useReferentiel'
import { SITUATION_FAMILIALE_OPTIONS, TYPE_PERSONNEL_OPTIONS, STATUT_PERSONNEL_OPTIONS } from '@/utils/constants'

const PersonnelForm = ({ defaultValues, onSubmit, loading }) => {
  const { etablissements, specialites, diplomes } = useReferentiel()
  const [photo,setPhoto]=useState(null); const [preview,setPreview]=useState(defaultValues?.photo_url??null)
  const { register, handleSubmit, control, watch, formState:{errors} } = useForm({
    resolver: zodResolver(personnelSchema),
    defaultValues: { type_personnel:'formateur',statut:'permanent',CIN:'',nom:'',prenom:'',date_naissance:'',situation_familiale:'',adresse_actuelle:'',lieu_naissance:'',nombre_enfant:'',telephone:'',grade:'',echelon:'',fonction:'',contact_nom:'',contact_telephone:'',idEtab:'',idSpecialite:'',diplomes:[],specialites_ens:[],...defaultValues,diplomes:defaultValues?.diplomes?.map(d=>d.idDiplome)??[],specialites_ens:defaultValues?.specialitesEnseignees?.map(s=>s.idSpecialite)??[] },
  })
  const typePersonnel=watch('type_personnel')
  const handlePhoto=(e)=>{ const f=e.target.files[0]; if(!f)return; setPhoto(f); setPreview(URL.createObjectURL(f)) }
  const handleFormSubmit=(data)=>onSubmit({...data,photo:photo??undefined})

  const MultiCheckbox = ({ options=[], value=[], onChange }) => {
    const toggle=(id)=>{ const n=Number(id); onChange(value.includes(n)?value.filter(v=>v!==n):[...value,n]) }
    return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">{options.map(opt=>{ const sel=value.includes(Number(opt.value)); return (
      <label key={opt.value} className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all select-none ${sel?'border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-600':'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
        <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${sel?'bg-primary-600 border-primary-600':'border-gray-300 dark:border-gray-600'}`}>{sel && <Check size={10} className="text-white"/>}</div>
        <input type="checkbox" checked={sel} onChange={()=>toggle(opt.value)} className="hidden"/>
        <span className={`text-xs font-medium truncate ${sel?'text-primary-700 dark:text-primary-300':'text-gray-600 dark:text-gray-400'}`}>{opt.label}</span>
      </label>) })}</div>
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="space-y-8">
        <FormSection title="Photo de profil" icon={<Camera size={16}/>}>
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden border-2 border-gray-200 dark:border-gray-600 flex items-center justify-center">{preview?<img src={preview} alt="Aperçu" className="w-full h-full object-cover"/>:<User size={32} className="text-gray-300 dark:text-gray-500"/>}</div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-600 rounded-xl flex items-center justify-center cursor-pointer shadow-md hover:bg-primary-700"><Camera size={14} className="text-white"/><input type="file" accept="image/*" className="hidden" onChange={handlePhoto}/></label>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1"><p className="font-medium text-gray-700 dark:text-gray-300">Photo optionnelle</p><p>JPG, PNG, WebP — 2 Mo max</p></div>
          </div>
        </FormSection>
        <FormSection title="Classification" icon={<Briefcase size={16}/>}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Type de personnel" required {...register('type_personnel')} error={errors.type_personnel?.message} options={TYPE_PERSONNEL_OPTIONS}/>
            <Select label="Statut" required {...register('statut')} error={errors.statut?.message} options={STATUT_PERSONNEL_OPTIONS}/>
            <Input label="CIN" required placeholder="AB123456" {...register('CIN')} error={errors.CIN?.message}/>
          </div>
        </FormSection>
        <FormSection title="Identité" icon={<User size={16}/>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Nom" required placeholder="Benali" {...register('nom')} error={errors.nom?.message}/>
            <Input label="Prénom" required placeholder="Ahmed" {...register('prenom')} error={errors.prenom?.message}/>
            <Input label="Date de naissance" type="date" {...register('date_naissance')} error={errors.date_naissance?.message}/>
            <Input label="Lieu de naissance" placeholder="Casablanca" {...register('lieu_naissance')} error={errors.lieu_naissance?.message}/>
            <Select label="Situation familiale" {...register('situation_familiale')} error={errors.situation_familiale?.message} options={SITUATION_FAMILIALE_OPTIONS}/>
            <Input label="Nombre d'enfants" type="number" min="0" {...register('nombre_enfant')} error={errors.nombre_enfant?.message}/>
            <Input label="Adresse actuelle" containerClass="sm:col-span-2" {...register('adresse_actuelle')} error={errors.adresse_actuelle?.message}/>
          </div>
        </FormSection>
        <FormSection title="Contact" icon={<Phone size={16}/>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Téléphone" placeholder="+212 6XX XXX XXX" {...register('telephone')} error={errors.telephone?.message}/>
            <div/>
            <Input label="Personne à contacter (nom)" {...register('contact_nom')} error={errors.contact_nom?.message}/>
            <Input label="Téléphone du contact" {...register('contact_telephone')} error={errors.contact_telephone?.message}/>
          </div>
        </FormSection>
        <FormSection title="Poste & Affectation" icon={<Briefcase size={16}/>}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Grade" {...register('grade')} error={errors.grade?.message}/>
            <Input label="Échelon" {...register('echelon')} error={errors.echelon?.message}/>
            <Input label="Fonction" containerClass="sm:col-span-2" {...register('fonction')} error={errors.fonction?.message}/>
            <Select label="Établissement" required {...register('idEtab')} error={errors.idEtab?.message} options={etablissements}/>
            <Select label="Spécialité principale" {...register('idSpecialite')} error={errors.idSpecialite?.message} options={specialites}/>
          </div>
        </FormSection>
        <FormSection title="Diplômes obtenus"><Controller name="diplomes" control={control} render={({field})=><MultiCheckbox options={diplomes} value={field.value} onChange={field.onChange}/>}/></FormSection>
        {typePersonnel==='formateur' && <FormSection title="Spécialités enseignées"><Controller name="specialites_ens" control={control} render={({field})=><MultiCheckbox options={specialites} value={field.value} onChange={field.onChange}/>}/></FormSection>}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={()=>window.history.back()}>Annuler</Button>
          <Button type="submit" loading={loading}>{defaultValues?'Enregistrer les modifications':'Créer le personnel'}</Button>
        </div>
      </div>
    </form>
  )
}
export default PersonnelForm
