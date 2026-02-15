import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchParticipantDetail } from '../services/adminService'

const getDirectionBreakdown = (responses = []) => {
  return responses.reduce(
    (acc, item) => {
      if (item.directionShown === 'left') acc.left += 1
      if (item.directionShown === 'right') acc.right += 1
      return acc
    },
    { left: 0, right: 0 },
  )
}

const asDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString()
}

function ParticipantDetailPage() {
  const { id } = useParams()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await fetchParticipantDetail(id)
        setRecord(data)
      } catch (requestError) {
        setError(requestError?.response?.data?.message || 'Failed to load participant details.')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      load()
    }
  }, [id])

  const responses = record?.responses || []
  const participant = record?.participant || {}
  const directionBreakdown = useMemo(() => getDirectionBreakdown(responses), [responses])

  return (
    <main className="dashboard-wrap">
      <section className="panel">
        <header className="panel-header">
          <div>
            <h1>Participant Detail</h1>
            <p>ID: {id}</p>
          </div>

          <Link className="secondary-link" to="/dashboard">
            Back to dashboard
          </Link>
        </header>

        {loading ? <p>Loading...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {!loading && !error && record ? (
          <>
            <section className="detail-grid">
              <article className="detail-card">
                <h2>Participant</h2>
                <p>
                  <strong>Name:</strong> {participant.name || '—'}
                </p>
                <p>
                  <strong>Age:</strong> {participant.age ?? '—'}
                </p>
                <p>
                  <strong>Gender:</strong> {participant.gender || '—'}
                </p>
                <p>
                  <strong>School:</strong> {participant.school || '—'}
                </p>
                <p>
                  <strong>City:</strong> {participant.city || '—'}
                </p>
                <p>
                  <strong>DOB:</strong> {asDate(participant.dob)}
                </p>
              </article>

              <article className="detail-card">
                <h2>Session Stats</h2>
                <p>
                  <strong>Total responses:</strong> {responses.length}
                </p>
                <p>
                  <strong>Correct:</strong> {record.correct ?? 0}
                </p>
                <p>
                  <strong>Wrong:</strong> {record.wrong ?? 0}
                </p>
                <p>
                  <strong>Missed:</strong> {record.missed ?? 0}
                </p>
                <p>
                  <strong>Average reaction time:</strong> {record.averageReactionTime ?? 0} ms
                </p>
                <p>
                  <strong>Direction breakdown:</strong> Left {directionBreakdown.left} | Right {directionBreakdown.right}
                </p>
              </article>
            </section>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Direction Shown</th>
                    <th>User Response</th>
                    <th>Reaction Time (ms)</th>
                    <th>Result</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.length === 0 ? (
                    <tr>
                      <td colSpan="5">No responses found.</td>
                    </tr>
                  ) : (
                    responses.map((item, index) => (
                      <tr key={`${item.directionShown}-${index}`}>
                        <td>{index + 1}</td>
                        <td>{item.directionShown}</td>
                        <td>{item.userResponse ?? '—'}</td>
                        <td>{item.reactionTime ?? '—'}</td>
                        <td>{item.result}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>
    </main>
  )
}

export default ParticipantDetailPage