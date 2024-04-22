export interface AddBlogPost {
    title: string,
    shortDescription: string,
    content: string,
    featuredImageUrl: string,
    UrlHandle: string,
    publishedDate: Date,
    author: string,
    isVisible: boolean,
    categories: string[]
}