import { Container } from '@/components/mdx/Container'
import { Prose } from '@/components/mdx/Prose'
import {MDXProvider} from '@mdx-js/react'

export const Heading2 = ({ children }) => {
  const idText = children.replace(/ /g, "_").toLowerCase();

  return <h2 id={idText} className='mt-12 mb-5 text-3xl font-semibold'>{children}</h2>;
};

export const Heading3 = ({ children }) => {
  const idText = children.replace(/ /g, "_").toLowerCase();

  return <h2 id={idText} className='mt-12 mb-5 text-2xl font-semibold'>{children}</h2>;
};


function ListItem({children}) {
  return <li className='my-2'>{children}</li>
}

export function ArticleLayout({
  children,
  meta,
}) {
  const components = {
    h2: Heading2,
    h3: Heading3,
    li: ListItem
  }

  return (
    <>
      <Container className="mt-4 lg:mt-8 ">
        <div className="xl:relative">
          <div className="mx-auto max-w-3xl">
            <article>
              <header className="flex flex-col">
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-black sm:text-5xl">
                  {meta.title}
                </h1>
              </header>
              <Prose className="mt-8">
                <MDXProvider components={components}>
                  {children}
                </MDXProvider>
              </Prose>
            </article>
          </div>
        </div>
      </Container>
    </>
  )
}
