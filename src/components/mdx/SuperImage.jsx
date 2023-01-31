import Image from 'next/image'

export function SuperImage({caption=false, center=false, square=false, ...props}) {
  return (
    <div className={`${square ? "not-prose" : ""} ${center ? "flex justify-center" : ""}`}>
      <figure>
        <Image {...props} />
        <div className="flex justify-center">
          {
            caption && (
              <figcaption>{caption}</figcaption>
            )
          }
        </div>
      </figure>
    </div>
  )
}