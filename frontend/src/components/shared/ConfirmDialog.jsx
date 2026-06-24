import Swal from 'sweetalert2'
export const confirmDelete = async (nom='cet élément') => {
  const r = await Swal.fire({title:'Confirmer la suppression',html:`Voulez-vous vraiment supprimer <strong>${nom}</strong> ?<br><span style="font-size:13px;color:#6b7280">Cette action est irréversible.</span>`,icon:'warning',showCancelButton:true,confirmButtonText:'Supprimer',cancelButtonText:'Annuler',confirmButtonColor:'#dc2626',cancelButtonColor:'#6b7280',reverseButtons:true})
  return r.isConfirmed
}
export const confirmAction = async ({title="Confirmer l'action",text='',icon='question',confirmText='Confirmer',cancelText='Annuler',confirmColor='#2563eb'}={}) => {
  const r = await Swal.fire({title,text,icon,showCancelButton:true,confirmButtonText:confirmText,cancelButtonText:cancelText,confirmButtonColor:confirmColor,cancelButtonColor:'#6b7280',reverseButtons:true})
  return r.isConfirmed
}
export default { confirmDelete, confirmAction }
