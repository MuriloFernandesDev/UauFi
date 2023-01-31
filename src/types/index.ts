export interface MapaProps {
    lat: number,
    lng: number,
    bairro: string,
    cidade: string,
    endereco: string,
    endereco_nr: string,
    uf: string,
    hotspot_nome: string,
    hotspot_id: number,
    total_visitas?: number,
    total_usuarios_online?: number,
}