import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { blogService } from '@/services/analytics.service'
import { PageLoader } from '@/components/ui/Spinner'
import { formatDate } from '@/utils'
import { ChevronLeft } from 'lucide-react'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => { blogService.getBySlug(slug).then(setBlog).finally(() => setLoading(false)) }, [slug])
  if (loading) return <PageLoader />
  if (!blog) return <div className="page-container py-16 text-center text-slate-500">Article not found.</div>
  return (
    <article className="page-container py-10 max-w-3xl animate-fade-in">
      <Link to="/blog" className="flex items-center gap-1 text-sm text-slate-500 hover:text-brand-600 mb-6"><ChevronLeft className="w-4 h-4" /> Back to Blog</Link>
      <span className="badge-blue text-xs mb-3 inline-block px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">{blog.category}</span>
      <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">{blog.title}</h1>
      <div className="flex items-center gap-3 text-sm text-slate-500 mb-6">
        <span>By <strong className="text-slate-700">{blog.author}</strong></span>
        <span>·</span>
        <span>{formatDate(blog.publishedAt)}</span>
      </div>
      {blog.coverImage && <img src={blog.coverImage} alt={blog.title} className="w-full rounded-2xl mb-8 aspect-video object-cover" />}
      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content || `<p>${blog.excerpt}</p>` }} />
    </article>
  )
}
