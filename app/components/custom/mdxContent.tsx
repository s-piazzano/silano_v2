'use client'

import { MDXRemote } from 'next-mdx-remote'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import Grid from '../ui/grid'
import ImageCard from '../ui/imageCard'
import ImageSlideshow from '../ui/ImageSlideshow'




const components = {
  Grid,
  ImageCard,
  ImageSlideshow
}

interface MDXContentProps {
  source: MDXRemoteSerializeResult
}

export default function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXRemote {...source} components={components} />
  )
}
