import { ShipmentForm } from '@/components/admin/shipment-form'
import { ui } from '@/components/admin/ui'

export default function NewShipment() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className={ui.h1}>New shipment</h1>
      <p className="text-sm text-muted-foreground">The tracking number is generated when you save. Add the sender or receiver email so the client can open the chat.</p>
      <ShipmentForm />
    </div>
  )
}
