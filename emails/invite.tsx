import { Body, Container, Head, Html, Link, Preview, Text } from '@react-email/components'

export default function InviteEmail({ inviterName, inviteLink }: { inviterName: string; inviteLink: string }) {
  return (
    <Html>
      <Head />
      <Preview>You are invited to GrowthOS</Preview>
      <Body>
        <Container>
          <Text>{inviterName} invited you to join GrowthOS.</Text>
          <Text>
            Accept invite: <Link href={inviteLink}>{inviteLink}</Link>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
