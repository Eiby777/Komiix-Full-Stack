import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Settings } from 'lucide-react'
import SettingsModal from '../dashbboard/SettingsModal'
import SubscriptionModal from './SubscriptionModal'
import { getUser } from '../../hooks/useAuth'

export default function Navbar() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [user, setUser] = useState(null)

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getUser();
      setUser(user)
    }
    checkAuth()
  }, [])

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Handle logout

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-primary dark:text-white">
          Komiix
        </Link>
        
        <div className="flex items-center space-x-4">
          {user && (
            <>
              <Link to="/dashboard" className="hover:text-primary dark:hover:text-gray-300">
                Dashboard
              </Link>
              
              <button
                onClick={() => setShowModal(true)}
                className="hover:text-primary dark:hover:text-gray-300"
              >
                Upgrade
              </button>
              
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </>
          )}
          
          {!user && (
            <Link to="/auth" className="hover:text-primary dark:hover:text-gray-300">
              Login
            </Link>
          )}
        </div>
      </div>
      
      {showUpgradeModal && <SubscriptionModal onClose={() => setShowUpgradeModal(false)} />}
      {showSettingsModal && <SettingsModal onClose={() => setShowSettingsModal(false)} />}
    </nav>
  )
}
