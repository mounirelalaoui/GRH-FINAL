import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input    from '@/components/ui/Input'
import Select   from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button   from '@/components/ui/Button'
import { absenceSchema } from '@/utils/validators'
import personnelService  from '@/services/personnelService'
const AbsenceForm = ({ defaultValues, onSubmit, loading }) => {
  const [personnelOptions,setPersonnelOptions]=useState([])
  const { register, handleSubmit, formState:{errors} } = useForm({ resolver:zodResolver(absenceSchema), defaultValues:{ idPersonnel:defaultValues?.idPersonnel??'', date_absence:defaultValues?.date_absence??new Date().toISOString().split('T')[0], motif:defaultValues?.motif??'' } })
  useEffect(()=>{ personnelService.getAll({per_page:999}).then(res=>setPersonnelOptions((res.data||res).map(p=>({value:p.idPersonnel,label:`${p.prenom} ${p.nom}`})))).catch(()=>{}) },[])
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="card p-6 space-y-5">
        <Select label="Personnel" required {...register('idPersonnel')} error={errors.idPersonnel?.message} options={personnelOptions}/>
        <Input label="Date d'absence" type="date" required {...register('date_absence')} error={errors.date_absence?.message}/>
        <Textarea label="Motif" placeholder="Motif de l'absence (facultatif)…" rows={3} {...register('motif')} error={errors.motif?.message}/>
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button variant="ghost" type="button" onClick={()=>window.history.back()}>Annuler</Button>
          <Button type="submit" loading={loading}>{defaultValues?'Enregistrer':"Créer l'absence"}</Button>
        </div>
      </div>
    </form>
  )
}
export default AbsenceForm
