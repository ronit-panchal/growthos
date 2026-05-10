import { Body, Container, Head, Html, Preview, Text } from '@react-email/components'

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to GrowthOS</Preview>
      <Body>
        <Container>
          <Text>Hi {name || 'there'},</Text>
          <Text>Welcome to GrowthOS. Your workspace is ready.</Text>
        </Container>
      </Body>
    </Html>
  )
}
