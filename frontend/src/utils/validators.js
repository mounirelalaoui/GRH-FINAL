import { z } from 'zod'
export const loginSchema = z.object({ email:z.string().email('Email invalide'), password:z.string().min(6,'Mot de passe trop court') })
export const personnelSchema = z.object({
  type_personnel:z.enum(['formateur','administratif']),statut:z.enum(['permanent','vacataire']),
  CIN:z.string().min(5,'CIN requis'),nom:z.string().min(2,'Nom requis'),prenom:z.string().min(2,'Prénom requis'),
  date_naissance:z.string().optional(),situation_familiale:z.string().optional(),adresse_actuelle:z.string().optional(),
  lieu_naissance:z.string().optional(),nombre_enfant:z.string().optional(),telephone:z.string().optional(),
  grade:z.string().optional(),echelon:z.string().optional(),fonction:z.string().optional(),
  contact_nom:z.string().optional(),contact_telephone:z.string().optional(),
  idEtab:z.coerce.number().min(1,'Établissement requis'),idSpecialite:z.coerce.number().optional(),
  diplomes:z.array(z.number()).optional(),specialites_ens:z.array(z.number()).optional(),
})
export const congeSchema = z.object({
  idPersonnel:z.coerce.number().min(1,'Personnel requis'),type_conge:z.string().min(1,'Type requis'),
  date_debut:z.string().min(1,'Date début requise'),date_fin:z.string().min(1,'Date fin requise'),
  date_demande:z.string().min(1,'Date demande requise'),statut:z.string().min(1,'Statut requis'),
}).refine(d=>new Date(d.date_fin)>=new Date(d.date_debut),{message:'La date de fin doit être après la date de début',path:['date_fin']})
export const absenceSchema = z.object({ idPersonnel:z.coerce.number().min(1,'Personnel requis'), date_absence:z.string().min(1,'Date requise'), motif:z.string().optional() })
export const etablissementSchema = z.object({ nom:z.string().min(2,'Nom requis'), ville:z.string().min(2,'Ville requise') })
export const specialiteSchema  = z.object({ nom_specialite:z.string().min(2,'Nom requis') })
export const diplomeSchema     = z.object({ nom_diplome:z.string().min(2,'Nom requis') })
export const userSchema = z.object({ username:z.string().min(3,"Nom d'utilisateur requis"), email:z.string().email('Email invalide'), password:z.string().min(8,'8 caractères minimum'), Role:z.enum(['directeurducomlex','gestionnairecfmr']), idPersonnel:z.coerce.number().optional() })
