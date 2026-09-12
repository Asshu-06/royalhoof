import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Calendar, MapPin, Clock, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

const WHATSAPP_NUMBER = "919043700776"

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [pastEvents, setPastEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('event_date', { ascending: true })

      if (error) {
        console.error('Supabase error loading events:', error)
        toast.error(`Failed to load events: ${error.message}`)
        throw error
      }

      console.log('Loaded events from database:', data)

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const upcoming = []
      const past = []

      data?.forEach(event => {
        const eventDate = new Date(event.event_date)
        eventDate.setHours(0, 0, 0, 0)

        if (eventDate >= today && event.status === 'upcoming') {
          upcoming.push({
            id: event.id,
            title: event.title,
            date: event.event_date,
            time: event.event_time || 'TBA',
            location: event.location || 'TBA',
            capacity: event.capacity || 0,
            registered: event.registered_count || 0,
            image: event.image_url || 'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800&q=80',
            description: event.description || '',
            category: event.category || 'Event'
          })
        } else {
          past.push({
            id: event.id,
            title: event.title,
            date: event.event_date,
            location: event.location || 'TBA',
            image: event.image_url || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80',
            description: event.description || '',
            category: event.category || 'Event'
          })
        }
      })

      console.log('Upcoming events:', upcoming)
      console.log('Past events:', past)

      setUpcomingEvents(upcoming)
      setPastEvents(past)
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = (event) => {
    const text = `*Event Registration*\n\nEvent: ${event.title}\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\n\nI would like to register for this event. Please confirm my participation.`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank")
    toast.success('Registration request sent!')
  }

  return (
    <>
      <Helmet>
        <title>Events - Academy</title>
        <meta name="description" content="Explore our upcoming and past events" />
      </Helmet>

      <div className="min-h-screen py-20 px-6 lg:px-12 xl:px-20" style={{ background: '#F4E9D2' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="eyebrow-label mb-3">Discover</p>
            <h1 className="heading-editorial text-4xl mb-4">
              <span style={{ color: "#292725" }}>Equestrian</span> <span style={{ color: "#D8C7A0", fontStyle: "italic" }}>Events</span>
            </h1>
            <div className="equestrian-divider w-24 mx-auto mb-6" />
            <p className="text-[#C5963A] max-w-2xl mx-auto">
              Join us for exciting competitions, workshops, and celebrations throughout the year
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-10">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-3 rounded-lg text-sm font-medium uppercase tracking-wider transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-[#C5963A] text-white'
                  : 'bg-[#FAF3E4] text-[#765334] hover:bg-[#FAF3E4]'
              }`}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-8 py-3 rounded-lg text-sm font-medium uppercase tracking-wider transition-all ${
                activeTab === 'past'
                  ? 'bg-[#C5963A] text-white'
                  : 'bg-[#FAF3E4] text-[#765334] hover:bg-[#FAF3E4]'
              }`}
            >
              Past Events
            </button>
          </div>

          {/* Events List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-[#C5963A] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : activeTab === 'upcoming' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto justify-items-center">
              {upcomingEvents.map(event => (
                <div key={event.id}
                  style={{
                    border: "1.5px solid #C5963A",
                    background: "#FAF3E4",
                    boxShadow: "0 4px 16px rgba(8, 43, 73, 0.08)"
                  }}
                  className="equestrian-card rounded-lg overflow-hidden flex flex-col justify-between max-w-[340px] w-full transition-all duration-300 hover:shadow-md"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-36 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <span className="bg-[#C5963A] text-white px-2.5 py-0.5 rounded-full text-[0.625rem] font-bold uppercase tracking-wider shadow-sm">
                          {event.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3.5 sm:p-4">
                      <h3 className="heading-editorial text-lg font-bold mb-1" style={{ color: "#292725" }}>{event.title}</h3>
                      {event.description && (
                        <p className="text-[#C5963A] text-xs mb-2.5 leading-relaxed line-clamp-2">{event.description}</p>
                      )}

                      {/* Event Details */}
                      <div className="space-y-1.5 mb-2.5 text-xs">
                        <div className="flex items-center gap-2 text-[#765334]">
                          <Calendar size={13} className="text-[#C5963A] shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString('en-IN', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                        {event.time && (
                          <div className="flex items-center gap-2 text-[#765334]">
                            <Clock size={13} className="text-[#C5963A] shrink-0" />
                            <span>{event.time}</span>
                          </div>
                        )}
                        {event.location && (
                          <div className="flex items-center gap-2 text-[#765334]">
                            <MapPin size={13} className="text-[#C5963A] shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                        {event.capacity > 0 && (
                          <div className="flex items-center gap-2 text-[#765334]">
                            <Users size={13} className="text-[#C5963A] shrink-0" />
                            <span>{event.registered}/{event.capacity} Registered</span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      {event.capacity > 0 && (
                        <div className="mb-3">
                          <div className="w-full bg-[#E5D4C1] rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-[#C5963A] h-full transition-all"
                              style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Register Button */}
                  <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 pt-0">
                    <button
                      onClick={() => handleRegister(event)}
                      disabled={event.capacity > 0 && event.registered >= event.capacity}
                      className={`w-full py-2 rounded-md font-bold uppercase tracking-wider text-xs transition-all ${
                        event.capacity > 0 && event.registered >= event.capacity
                          ? 'bg-[#E5D4C1] text-[#765334] cursor-not-allowed'
                          : 'bg-[#C5963A] hover:bg-[#8A6640] text-white shadow-sm'
                      }`}
                    >
                      {event.capacity > 0 && event.registered >= event.capacity ? 'Fully Booked' : 'Register Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto justify-items-center">
              {pastEvents.map(event => (
                <div key={event.id}
                  style={{
                    border: "1.5px solid #C5963A",
                    background: "#FAF3E4",
                    boxShadow: "0 4px 16px rgba(8, 43, 73, 0.08)"
                  }}
                  className="equestrian-card rounded-lg overflow-hidden group max-w-[340px] w-full transition-all duration-300 hover:shadow-md"
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="bg-[#FAF3E4] text-[#765334] px-2.5 py-0.5 rounded-full text-[0.625rem] font-bold uppercase tracking-wider border border-[#082B49]/30">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3.5 sm:p-4">
                    <h3 className="heading-editorial text-lg font-bold mb-1" style={{ color: "#292725" }}>{event.title}</h3>
                    {event.description && (
                      <p className="text-[#C5963A] text-xs mb-2.5 leading-relaxed line-clamp-2">{event.description}</p>
                    )}

                    <div className="flex items-center gap-2 text-[#765334] text-xs">
                      <Calendar size={13} className="text-[#C5963A] shrink-0" />
                      <span>{new Date(event.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && ((activeTab === 'upcoming' && upcomingEvents.length === 0) || 
            (activeTab === 'past' && pastEvents.length === 0)) && (
            <div className="text-center py-20 equestrian-card rounded-lg" style={{ border: "1.5px solid #082B49" }}>
              <p className="text-[#765334] text-lg font-medium">No {activeTab} events at the moment</p>
              <p className="text-[#765334] text-sm mt-2">Check back soon for updates!</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
