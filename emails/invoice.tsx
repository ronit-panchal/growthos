import { Body, Container, Head, Html, Preview, Text } from '@react-email/components'

export default function InvoiceEmail({ amountInr, invoiceId }: { amountInr: number; invoiceId: string }) {
  return (
    <Html>
      <Head />
      <Preview>Your GrowthOS invoice</Preview>
      <Body>
        <Container>
          <Text>Invoice #{invoiceId}</Text>
          <Text>Amount paid: INR {amountInr.toLocaleString('en-IN')}</Text>
        </Container>
      </Body>
    </Html>
  )
}
