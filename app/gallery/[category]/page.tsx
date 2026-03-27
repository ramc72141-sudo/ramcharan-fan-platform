import GalleryPageClient from '../gallery-client'

export default function Page({
  params,
}: {
  params: { category: string }
}) {
  return <GalleryPageClient category={params.category} />
}