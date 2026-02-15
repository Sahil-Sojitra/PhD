import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/PageShell'
import { createParticipant } from '../services/participantService'

const requiredFields = [
    'name',
    'dob',
    'age',
    'gender',
    'parentName',
    'std',
    'school',
    'city',
    'contactNo',
]

const initialValues = {
    name: '',
    dob: '',
    age: '',
    gender: '',
    parentName: '',
    std: '',
    school: '',
    city: '',
    contactNo: '',
}

const extractParticipantId = (data) => {
    const candidates = [
        data?.data?.participantId,
        data?.data?.id,
        data?.data?._id,
        data?.participantId,
        data?.id,
        data?._id,
        data?.participant?.participantId,
        data?.participant?.id,
        data?.participant?._id,
    ]

    return candidates.find(Boolean)
}

function ParticipantFormPage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState(initialValues)
    const [errors, setErrors] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    const genderOptions = useMemo(() => ['Male', 'Female', 'Other'], [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrors((prev) => ({ ...prev, [name]: '' }))
    }

    const validate = () => {
        const nextErrors = {}

        requiredFields.forEach((field) => {
            if (!String(formData[field] ?? '').trim()) {
                nextErrors[field] = 'Required'
            }
        })

        if (formData.contactNo && !/^\d{10,15}$/.test(formData.contactNo.trim())) {
            nextErrors.contactNo = 'Enter valid contact number'
        }

        return nextErrors
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSubmitError('')

        const validationErrors = validate()
        setErrors(validationErrors)

        if (Object.keys(validationErrors).length > 0) return

        try {
            setSubmitting(true)
            const payload = {
                ...formData,
                age: Number(formData.age),
                contactNo: formData.contactNo.trim(),
            }

            const response = await createParticipant(payload)
            const participantId = extractParticipantId(response?.data)

            if (!participantId) {
                throw new Error('Participant ID missing in response')
            }

            localStorage.setItem('participantId', String(participantId))
            navigate('/instructions', { replace: true })
        } catch {
            setSubmitError('Unable to submit participant details. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <PageShell
            title="Participant Details"
            footer={
                <button type="submit" form="participant-form" className="primary-btn" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Continue'}
                </button>
            }
        >
            <form id="participant-form" className="form-grid" onSubmit={handleSubmit} noValidate>
                <label>
                    Name
                    <input name="name" value={formData.name} onChange={handleChange} autoComplete="off" />
                    {errors.name ? <span className="error-text">{errors.name}</span> : null}
                </label>

                <label>
                    DOB
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                    {errors.dob ? <span className="error-text">{errors.dob}</span> : null}
                </label>

                <label>
                    Age
                    <input type="number" name="age" min="1" max="120" value={formData.age} onChange={handleChange} />
                    {errors.age ? <span className="error-text">{errors.age}</span> : null}
                </label>

                <label>
                    Gender
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="">Select</option>
                        {genderOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    {errors.gender ? <span className="error-text">{errors.gender}</span> : null}
                </label>

                <label>
                    Parent Name
                    <input name="parentName" value={formData.parentName} onChange={handleChange} autoComplete="off" />
                    {errors.parentName ? <span className="error-text">{errors.parentName}</span> : null}
                </label>

                <label>
                    Standard
                    <input name="std" value={formData.std} onChange={handleChange} autoComplete="off" />
                    {errors.std ? <span className="error-text">{errors.std}</span> : null}
                </label>

                <label>
                    School
                    <input name="school" value={formData.school} onChange={handleChange} autoComplete="off" />
                    {errors.school ? <span className="error-text">{errors.school}</span> : null}
                </label>

                <label>
                    City
                    <input name="city" value={formData.city} onChange={handleChange} autoComplete="off" />
                    {errors.city ? <span className="error-text">{errors.city}</span> : null}
                </label>

                <label>
                    Contact Number
                    <input name="contactNo" value={formData.contactNo} onChange={handleChange} inputMode="numeric" />
                    {errors.contactNo ? <span className="error-text">{errors.contactNo}</span> : null}
                </label>
            </form>
            {submitError ? <p className="error-banner">{submitError}</p> : null}
        </PageShell>
    )
}

export default ParticipantFormPage