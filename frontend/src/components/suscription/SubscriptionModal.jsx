import { useState } from 'react'

    export default function SubscriptionModal({ onClose }) {
      const [selectedPlan, setSelectedPlan] = useState('monthly')

      const handleSubscribe = () => {
        // TODO: Integrate with payment gateway
        onClose()
      }

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Upgrade to Premium</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text">
                  Select Plan
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="monthly">Monthly ($9.99/month)</option>
                  <option value="yearly">Yearly ($99.99/year)</option>
                </select>
              </div>
              <button
                onClick={handleSubscribe}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Subscribe
              </button>
              <button
                onClick={onClose}
                className="w-full px-4 py-2 text-text hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )
    }
