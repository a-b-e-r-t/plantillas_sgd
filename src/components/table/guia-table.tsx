'use client'

import React, { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {  ChevronLeft, ChevronRight } from "lucide-react"

interface Guia {
  param: string
  desc: string
}

interface GuiaTableProps {
  guias: Guia[]
}

export default function GuiaTable({ guias }: GuiaTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredDocuments, setFilteredDocuments] = useState(guias)

  useEffect(() => {
    const filtered = guias.filter(
      (doc) =>
        doc.desc.toLowerCase().includes(searchTerm.toLowerCase()) || 
        doc.param.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDocuments(filtered)
    setCurrentPage(1)
  }, [searchTerm, guias])

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex)

  return (
    <div className="space-y-4 bg-card p-2 rounded-lg border border-border">
      <h1 className="text-lg font-semibold text-center mt-2">
        Parámetros que se utilizan en las plantillas de los documentos para el SGD.
      </h1>
      <div className="h-[1px] w-full bg-border"></div>
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
            <TableHead className="w-[150px]">Parámetro</TableHead>
            <TableHead>Descripción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentDocuments.map((document) => (
            <TableRow key={document.param}>
              <TableCell className="font-medium">{document.param}</TableCell>
              <TableCell>{document.desc}</TableCell>
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