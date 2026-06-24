import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Input  from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { congeSchema } from '@/utils/validators'
import personnelService from '@/services/personnelService'
import { TYPE_CONGE_OPTIONS, STATUT_CONGE_OPTIONS } from '@/utils/constants'
import { diffDays } from '@/utils/helpers'
const CongeForm = ({ defaultValues, onSubmit, loading }) => {
  const [personnelOptions,setPersonnelOptions]=useState([])
  const { register, handleSubmit, watch, formState:{errors} } = useForm({ resolver:zodResolver(congeSchema), defaultValues:{ idPersonnel:defaultValues?.idPersonnel??'', type_conge:defaultValues?.type_conge??'', date_debut:defaultValues?.date_debut??'', date_fin:defaultValues?.date_fin??'', date_demande:defaultValues?.date_demande??new Date().toISOString().split('T')[0], statut:defaultValues?.statut??'en_attente' } })
  const debut=watch('date_debut'), fin=watch('date_fin'); const duree=debut&&fin?diffDays(debut,fin):0
  useEffect(()=>{ personnelService.getAll({per_page:999}).then(res=>setPersonnelOptions((res.data||res).map(p=>({value:p.idPersonnel,label:`${p.prenom} ${p.nom}`})))).catch(()=>{}) },[])
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="card p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Personnel" required {...register('idPersonnel')} error={errors.idPersonnel?.message} options={personnelOptions} containerClass="sm:col-span-2"/>
          <Select label="Type de congé" required {...register('type_conge')} error={errors.type_conge?.message} options={TYPE_CONGE_OPTIONS}/>
          <Select label="Statut" required {...register('statut')} error={errors.statut?.message} options={STATUT_CONGE_OPTIONS}/>
          <Input label="Date de début" type="date" required {...register('date_debut')} error={errors.date_debut?.message}/>
          <Input label="Date de fin" type="date" required {...register('date_fin')} error={errors.date_fin?.message}/>
          <Input label="Date de demande" type="date" required {...register('date_demande')} error={errors.date_demande?.message}/>
          {duree>0 && <div className="sm:col-span-2 flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3"><span className="text-blue-600 dark:text-blue-400 text-xl">📅</span><p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Durée : {duree} jour{duree>1?'s':''}</p></div>}
        </div>
        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <Button variant="ghost" type="button" onClick={()=>window.history.back()}>Annuler</Button>
          <Button type="submit" loading={loading}>{defaultValues?'Enregistrer':'Créer le congé'}</Button>
        </div>
      </div>
    </form>
  )
}
export default CongeForm
