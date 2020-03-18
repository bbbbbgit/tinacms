/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as React from 'react'
import { BlockField } from './inline-block-field'
import { InlineImageProps, ImageUpload } from '../inline-field-image'
import { useCMS } from 'tinacms'

export function BlockImage({
  name,
  children,
  parse,
  uploadDir,
}: InlineImageProps) {
  const cms = useCMS()
  return (
    <BlockField name={name}>
      {({ input, status, form }) => {
        if (status === 'active') {
          return (
            <ImageUpload
              value={input.value}
              onDrop={async ([file]: File[]) => {
                const directory = uploadDir(form)
                const [media] = await cms.media.store.persist([
                  {
                    directory,
                    file,
                  },
                ])
                if (media) {
                  input.onChange(parse(media.filename))
                } else {
                  // TODO Handle failure
                }
                return null
              }}
              {...input}
            >
              {children}
            </ImageUpload>
          )
        }
        return children ? children : <img src={input.value} />
      }}
    </BlockField>
  )
}
