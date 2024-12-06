import { Suspense } from "react"
import RegisterForm from "../../components/RegisterForm/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Cargando...</div>}>
      <RegisterForm />
    </Suspense>
    </div>
  )
}
