import { DictionaryService } from '../services/dictionary'

export const DictionaryActions = {
    generics
}

function generics (params = { }) {
    return dispatch => new Promise((resolve, reject) => {
        dispatch({ type: 'FILLING', payload: true })
        dispatch({ type: 'DICTIONARY_GENERICS_REQUEST' })

        DictionaryService.generics(params)
            .then(
                generics => {
                    dispatch({ type: 'DICTIONARY_GENERICS_SUCCESS', payload: generics })
                    dispatch({ type: 'FILLING', payload: false })
<<<<<<< HEAD
                    resolve()
=======
                    resolve(generics)
>>>>>>> 4fca0b746db03001dfaf7ffa390524fcc95fa8c3
                },
                error => {
                    dispatch({ type: 'DICTIONARY_GENERICS_FAILURE' })
                    dispatch({ type: 'ALERT_ERROR', payload: error.message })
                    dispatch({ type: 'FILLING', payload: false })
                    reject()
                }
            )
    })
}
