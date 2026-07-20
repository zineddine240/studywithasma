<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# StudyWithAsma Project Rules & Architecture

## Technology Stack
- **Framework:** Next.js 16 (App Router), React 19
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Forms & Validation:** React Hook Form, Zod, shadcn field
- **Data Fetching & State:** TanStack React Query (@tanstack/react-query)
- **Backend (Auth, DB, Storage):** Supabase (Cloud managed version)
- **AI Integration:** Google Gemini API (`@google/genai`)

## Project Constraints
- **Development Budget:** Highly constrained ($250 USD / 60,000 DZD). Agents must favor simplicity, rapid development, and leverage existing shadcn/ui components. No over-engineering.
- **Hosting Strategy:** Deployed on Vercel with a managed Cloud Supabase database instance.

## AI Workflow & Generation
- **Admin-Only Pattern:** The Gemini API must ONLY be triggered from Admin-protected routes/dashboards.
- **Pre-Generation:** Admins generate IELTS practice materials and English Level Tests beforehand.
- **Student Consumption:** Students read/take tests from the Supabase database. They do not trigger the Gemini API directly. This ensures predictable costs and quality control.

## Forms & Validation Pattern
We strictly use **Shadcn Field** components combined with **React Hook Form** (without the generic `<Form>` context wrapper).

**Example Implementation:**
```tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Field>
        <FieldLabel htmlFor="title">Title</FieldLabel>
        <FieldContent>
          <Input id="title" {...register("title")} />
        </FieldContent>
        <FieldError errors={[errors.title]} />
      </Field>
    </form>
  )
}
```

## Dropdown & Select Component Rules
- **Display Human-Readable Labels, Never Raw IDs/Values:** When using `<Select>` or custom pickers for items with UUIDs or internal keys (such as course IDs, student profile IDs, or expiry duration codes), always ensure `<SelectValue>` displays the human-readable label (e.g. course title, student name & email, humanized duration label) instead of falling back to the raw ID/value.

