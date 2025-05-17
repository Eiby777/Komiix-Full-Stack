import { useState } from 'react'
    import { supabase } from '../lib/supabaseClient'

    export default function Auth() {
      const [email, setEmail] = useState('')
      const [password, setPassword] = useState('')

      const handleLogin = async (e) => {
        e.preventDefault()
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) console.error(error)
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      )
    }
