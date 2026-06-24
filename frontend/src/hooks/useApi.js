import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Hook générique pour exécuter un appel API avec état loading/error
 * Usage : const { execute, loading, error } = useApi(myService.create)
 */
export const useApi = (apiFunc) => {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await apiFunc(...args)
      return result
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunc])

  return { execute, loading, error }
}

/**
 * Variante avec toast de succès automatique
 */
export const useMutation = (apiFunc, { successMessage = 'Opération réussie', onSuccess, onError } = {}) => {
  const { execute, loading, error } = useApi(apiFunc)

  const mutate = async (...args) => {
    try {
      const result = await execute(...args)
      toast.success(successMessage)
      onSuccess?.(result)
      return result
    } catch (err) {
      onError?.(err)
      throw err
    }
  }

  return { mutate, loading, error }
}

export default useApi
