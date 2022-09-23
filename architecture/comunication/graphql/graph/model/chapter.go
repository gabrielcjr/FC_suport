package model

type Chapter struct {
	ID       string    `json:"id"`
	Name     string    `json:"name"`
	Courses  *Course   `json:"courses"`
	Category *Category `json:"category"`
}