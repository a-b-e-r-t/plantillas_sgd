import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, ChevronLeft, ChevronRight } from "lucide-react"

interface Remito {
  nu_emi: string
  co_emp_emi: string
  de_doc_sig: string
  nu_doc_emi: string
}

interface RemitoTableProps {
  remitos: Remito[]
  onEdit: (document: Remito) => void
}

export default function RemitoTable({ remitos, onEdit }: RemitoTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDocuments, setFilteredDocuments] = useState(remitos)

  useEffect(() => {
    const filtered = remitos.filter(
      (doc) =>
        doc.de_doc_sig.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDocuments(filtered)
    setCurrentPage(1)
  }, [searchTerm, remitos])

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex)

  return (
    <div className="space-y-4 bg-card p-2 rounded-lg border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <Input
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
          <SelectTrigger className="w-[180px] border-border">
            <SelectValue placeholder="Items por página" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 por página</SelectItem>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="20">20 por página</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table className="border border-border rounded-lg overflow-hidden">
        <TableHeader>
          <TableRow className="bg-popover">
            <TableHead>Número de emisión</TableHead>
            <TableHead>Código empleado emite</TableHead>
            <TableHead>Siglas</TableHead>
            <TableHead>Número de correlativo</TableHead>
            <TableHead className="text-right">Opciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentDocuments.map((document) => (
            <TableRow key={document.nu_emi}>
              <TableCell>{document.nu_emi}</TableCell>
              <TableCell>{document.co_emp_emi}</TableCell>
              <TableCell>{document.de_doc_sig}</TableCell>
              <TableCell className="font-medium">{document.nu_doc_emi}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    title="Modificar"
                    onClick={() => onEdit(document)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Modificar {document.nu_emi}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredDocuments.length)} de {filteredDocuments.length}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            Página {currentPage} de {totalPages}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}