export type Category = '문제형' | '실습형' | '미분류'

export type Exam = {
    id: string
    name: string
    description: string
    href: string | null
    category: Category
    chapter: string
}
