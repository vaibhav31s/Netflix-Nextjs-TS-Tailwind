import { DocumentData } from 'firebase/firestore'
import { atom } from 'jotai'
import { Movie } from '../typing'

export const modalState = atom(false)

export const movieState = atom<Movie | DocumentData | null>(null)
